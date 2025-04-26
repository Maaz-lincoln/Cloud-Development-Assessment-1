import logging
from transformers import BartForConditionalGeneration, BartTokenizer
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    model_name = "facebook/bart-large-cnn"
    model = BartForConditionalGeneration.from_pretrained(model_name)
    tokenizer = BartTokenizer.from_pretrained(model_name)
    logger.info(f"BART model ({model_name}) loaded successfully")
except Exception as e:
    logger.error(f"Failed to load BART model ({model_name}): {str(e)}")
    model_name = "sshleifer/distilbart-cnn-6-6"
    try:
        model = BartForConditionalGeneration.from_pretrained(model_name)
        tokenizer = BartTokenizer.from_pretrained(model_name)
        logger.info(f"Fallback BART model ({model_name}) loaded successfully")
    except Exception as fallback_e:
        logger.error(f"Failed to load fallback BART model ({model_name}): {str(fallback_e)}")
        raise RuntimeError(f"Failed to load BART models: {str(e)}, {str(fallback_e)}")

def summarize_text(text: str) -> str:
    logger.info(f"Input text: {text}")
    try:
        if not text.strip():
            logger.error("Input text is empty")
            return "[Error summarizing text: Input text is empty]"

        inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)

        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=60,   
            min_length=20,
            num_beams=10,     
            length_penalty=0.5,
            early_stopping=True,
            no_repeat_ngram_size=3  
        )

        summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        logger.info(f"Raw summary: {summary_text}")

        return summary_text

    except Exception as e:
        logger.error(f"Error summarizing text: {str(e)}")
        return f"[Error summarizing text: {str(e)}]"

async def send_notification(db, user, message, type="info"):
    from crud import create_notification
    return await create_notification(db, user, message, type)