import os
import boto3
from dotenv import load_dotenv
 
# Load variables from .env into the process environment
load_dotenv()
 
 
def configure_bedrock_client():
    """
    Configure and return a boto3 Bedrock Runtime client using the
    Bedrock API key (bearer token) and region from the environment.
 
    boto3/botocore automatically picks up the AWS_BEARER_TOKEN_BEDROCK
    environment variable for bearer-token authentication with the
    bedrock-runtime service, so no explicit credentials need to be passed.
    """

    region = os.getenv("AWS_REGION")
 
    if not region:
        raise ValueError("AWS_REGION is not set in .env")
 
    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=region,
    )
    return client
 
 
def get_ai_recommendation(
    destination: str,
    days: int, 
    budget: float, 
    travel_style: str):
    """
    Call AWS Bedrock to get an AI-generated travel itinerary.
 
    Args:
        days (int | str): Number of days for the trip.
        destination (str): Travel destination.
        budget (int | str): Budget in USD.
        travel_style (str): Style of travel (e.g. "luxury", "backpacking").
 
    Returns:
        str: The AI-generated itinerary text.
    """
    client = configure_bedrock_client()
    model_id = os.getenv("MODEL_ID")
 
    if not model_id:
        raise ValueError("MODEL_ID is not set in .env")
 
    prompt = (
        "You are an experienced travel planner.\n"
        f"Plan a {days}-day itinerary for {destination}.\n"
        f"Budget: USD {budget}\n"
        f"Travel Style: {travel_style}\n\n"
        f"For each dayit mus contain this:\n"
        f"1. Morning activites: give 2-3 activities to do in the morning\n"
        f"2. Afternoon activites: give recommendation for cultural sites and local experiences"
        f"3. Evening activites: give recommendation for dinner and halal nightlife\n"
    )
 
    try:
        response = client.converse(
            modelId=model_id,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
            inferenceConfig={
                "maxTokens": 2048,
                "temperature": 0.7,
                "topP": 0.9,
            },
        )
 
        output_message = response["output"]["message"]
        recommendation = "".join(
            block.get("text", "") for block in output_message["content"]
        )
        return recommendation
 
    except Exception as e:
        raise RuntimeError(f"Failed to get AI recommendation from Bedrock: {e}")