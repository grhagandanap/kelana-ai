import os

import boto3
from dotenv import load_dotenv

load_dotenv()

# ------------------------------------------------
# Configuration
# ------------------------------------------------

AWS_REGION: str = os.getenv("AWS_REGION", "ap-southeast-2")
KNOWLEDGE_BASE_ID: str | None = os.getenv("KNOWLEDGE_BASE_ID")


def get_bedrock_agent_runtime_client():
    """
    Build and return a boto3 Bedrock Agent Runtime client.

    Bedrock Agent Runtime uses standard AWS SigV4 credentials.
    """
    return boto3.client(
        service_name="bedrock-agent-runtime",
        region_name=AWS_REGION,
    )


def retrieve_and_generate(query: str) -> dict:
    """
    Retrieve relevant content from the Bedrock Knowledge Base.

    Managed knowledge bases support Retrieve, not RetrieveAndGenerate.

    Args:
        query: The user's question.

    Returns:
        The retrieved text snippets and their source information.

    Raises:
        ValueError: If required environment variables are missing.
        Exception: Propagated from boto3 / Bedrock on API errors.
    """
    missing_vars: list[str] = [
        name
        for name, value in {
            "KNOWLEDGE_BASE_ID": KNOWLEDGE_BASE_ID,
        }.items()
        if not value
    ]
    if missing_vars:
        raise ValueError(
            f"{', '.join(missing_vars)} is not set. "
            "Check your .env file."
        )

    client = get_bedrock_agent_runtime_client()

    response = client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={"text": query},
        retrievalConfiguration={
            "managedSearchConfiguration": {
                "numberOfResults": 5,
            },
        },
    )

    results = response.get("retrievalResults", [])
    snippets: list[str] = []
    sources: list[dict] = []
    seen_sources: set[str] = set()

    for result in results:
        content = result.get("content", {})
        text = content.get("text", "").strip()
        if text:
            snippets.append(text)

        source_key = result.get("documentId") or repr(result.get("location"))
        if source_key in seen_sources:
            continue

        seen_sources.add(source_key)
        sources.append(
            {
                "document_id": result.get("documentId"),
                "location": result.get("location"),
                "metadata": result.get("metadata", {}),
                "score": result.get("score"),
            }
        )

    return {
        "answer": "\n\n".join(snippets),
        "source": sources,
    }

# import os
# import boto3
# from dotenv import load_dotenv

# load_dotenv()

# client = boto3.client(
#     "bedrock-agent-runtime",
#     region_name=os.getenv("AWS_REGION", "us-east-1"),
#     aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
#     aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
# )

# KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")
# KNOWLEDGE_BASE_MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN")


# def ask_knowledge_base(question: str):
#     response = client.retrieve_and_generate(
#         input={"text": question},
#         retrieveAndGenerateConfiguration={
#             "type": "KNOWLEDGE_BASE",
#             "knowledgeBaseConfiguration": {
#                 "knowledgeBaseId": KNOWLEDGE_BASE_ID,
#                 "modelArn": KNOWLEDGE_BASE_MODEL_ARN,
#             },
#         },
#     )

#     return response["output"]["text"]

