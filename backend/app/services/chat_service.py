import os
import re
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

from app.models.models import Message, Project

load_dotenv()


def get_project_messages(db: Session, project_id: int, limit: int = 50):
    messages = db.query(Message).filter(Message.project_id == project_id).order_by(Message.created_at.asc()).all()
    return messages[-limit:] if limit and len(messages) > limit else messages


def save_message(db: Session, project_id: int, role: str, content: str) -> Message:
    message = Message(project_id=project_id, role=role, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def clean_agent_response(text: str) -> str:
    """Removes useless markdown table symbols, bold asterisks, header hashtags, and divider lines outside code blocks."""
    if not text:
        return text

    code_block_pattern = re.compile(r'(```[\s\S]*?```)')
    parts = code_block_pattern.split(text)
    cleaned_parts = []

    for i, part in enumerate(parts):
        if i % 2 == 1:
            # Code block - preserve as is
            cleaned_parts.append(part)
        else:
            lines = part.splitlines()
            filtered_lines = []
            for line in lines:
                stripped = line.strip()
                # Skip divider lines and table header separators
                if re.match(r'^(?:-{2,}|\*{2,}|={2,}|_{2,}|\|[\s:\|-]+\|)$', stripped):
                    continue
                # Strip leading header hashtags
                line = re.sub(r'^#{1,6}\s*', '', line)
                # Convert table rows to clean lists
                if '|' in line:
                    cells = [c.strip() for c in line.split('|') if c.strip()]
                    line = " - ".join(cells) if cells else ""
                    if not line:
                        continue
                line = re.sub(r'^[•✦★❖■▶►➢]\s*', '- ', line)
                filtered_lines.append(line)

            cleaned_prose = "\n".join(filtered_lines)
            cleaned_prose = re.sub(r'\*{1,2}(.*?)\*{1,2}', r'\1', cleaned_prose)
            cleaned_prose = re.sub(r'_{1,2}(.*?)_{1,2}', r'\1', cleaned_prose)
            cleaned_parts.append(cleaned_prose)

    result = "".join(cleaned_parts)
    return re.sub(r'\n{3,}', '\n\n', result).strip()


def generate_chat_response(db: Session, project_id: int, user_message: str, user_id: int) -> str:
    openrouter_key = (os.getenv("OPENROUTER_API_KEY") or "").strip('"\' ')
    openai_key = (os.getenv("OPENAI_API_KEY") or "").strip('"\' ')
    llm_model = os.getenv("LLM_MODEL", "google/gemma-4-31b-it:free").strip('"\' ')

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    if project.user_id != user_id:
        raise ValueError("Unauthorized access to project")

    api_key = openrouter_key or openai_key
    if not api_key or api_key == "your-openrouter-api-key-here":
        raise ValueError("API key not configured. Please set OPENROUTER_API_KEY in backend/.env")

    recent_messages = get_project_messages(db, project_id, limit=10)
    save_message(db, project_id, "user", user_message)

    system_prompt_text = project.system_prompt or "You are a helpful, professional AI assistant."
    if project.description and project.description.strip() and "Project Context & Goal:" not in system_prompt_text:
        system_prompt_text += f"\n\nProject Context & Goal: {project.description.strip()}"

    system_prompt_text += (
        "\n\nSTRICT RESPONSE FORMATTING RULES (MANDATORY):\n"
        "1. Do NOT use markdown tables with vertical bars (|) or divider lines (---, ===).\n"
        "2. Do NOT use markdown bold asterisks (**text**), italic asterisks (*text*), or hashtag headers (###).\n"
        "3. Write in clean, natural plain text using simple titles, paragraph breaks, and clean bullet points (-) or numbered lists (1., 2.).\n"
        "4. Standard markdown code blocks are allowed when providing programming code."
    )

    messages = [SystemMessage(content=system_prompt_text)]
    for msg in recent_messages:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            messages.append(AIMessage(content=msg.content))
    messages.append(HumanMessage(content=user_message))

    try:
        if openrouter_key and openrouter_key != "your-openrouter-api-key-here":
            llm = ChatOpenAI(
                model=llm_model,
                openai_api_key=openrouter_key,
                openai_api_base="https://openrouter.ai/api/v1",
                temperature=0.7,
                default_headers={
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "AI Chatbot Platform"
                }
            )
        else:
            llm = ChatOpenAI(model="gpt-3.5-turbo", openai_api_key=openai_key, temperature=0.7)

        response = llm.invoke(messages)
        assistant_message = clean_agent_response(response.content)

        save_message(db, project_id, "assistant", assistant_message)
        return assistant_message
    except Exception as e:
        raise ValueError(f"Failed to generate response: {str(e)}")
