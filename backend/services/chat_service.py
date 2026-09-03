import os
from services.bedrock_service import configure_bedrock_client  
# ^ move configure_bedrock_client to a shared file so both services can import it
#   without duplicating it — see note below

from models.conversation import Message


SYSTEM_PROMPT = (
    "You are Kelana, a friendly and knowledgeable travel assistant. "
    "Help the user plan trips, answer travel questions, and give practical, "
    "concise recommendations. Keep responses conversational."
)


def build_bedrock_messages(messages: list[Message]) -> list[dict]:
    """
    Convert a list of Message ORM objects (ordered oldest -> newest)
    into Bedrock's expected `messages` format.
    """
    bedrock_messages = []
    for msg in messages:
        bedrock_messages.append(
            {
                "role": msg.role,  # must be "user" or "assistant"
                "content": [{"text": msg.content}],
            }
        )
    return bedrock_messages


def get_chat_reply(conversation_history: list[Message]) -> str:
    """
    Call AWS Bedrock with the full conversation history and get the
    assistant's next reply.

    Args:
        conversation_history: ordered list of Message objects (oldest first),
            ending with the latest user message.

    Returns:
        str: the AI-generated reply text.
    """
    client = configure_bedrock_client()
    model_id = os.getenv("MODEL_ID")

    bedrock_messages = build_bedrock_messages(conversation_history)

    try:
        response = client.converse(
            modelId=model_id,
            messages=bedrock_messages,
            system=[{"text": SYSTEM_PROMPT}],
            inferenceConfig={
                "maxTokens": 1024,
                "temperature": 0.7,
                "topP": 0.9,
            },
        )

        output_message = response["output"]["message"]
        reply = "".join(
            block.get("text", "") for block in output_message["content"]
        )
        return reply

    except Exception as e:
        raise RuntimeError(f"Failed to get AI reply from Bedrock: {e}")