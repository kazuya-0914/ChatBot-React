from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from transformers import AutoModelForQuestionAnswering, BertJapaneseTokenizer
import torch

model_name = 'KoichiYasuoka/bert-base-japanese-wikipedia-ud-head'
model = AutoModelForQuestionAnswering.from_pretrained(model_name)

def home(request):
  return render(request, 'home.html')

@csrf_exempt
def bot_response(request):
  if request.method == 'POST':
    data = json.loads(request.body)
    question = data.get('input_text', '')

    if not question:
      return JsonResponse({'error': '質問が入力されていません'}, status=400)
    
    # ボットの応答を生成
    bot_reply = reply(question)

    return JsonResponse({'bot_response': bot_reply})
  return JsonResponse({'error': 'Invalid request'}, status=400)

def reply(question):
  tokenizer = BertJapaneseTokenizer.from_pretrained(model_name)
  context = "私の名前は山田です。趣味は動画鑑賞とショッピングです。年齢は30歳です。出身は大阪府です。仕事は医者です。"
  
  inputs = tokenizer.encode_plus(question, context, add_special_tokens=True, return_tensors="pt")
  input_ids = inputs["input_ids"].tolist()[0]
  output = model(**inputs)
  answer_start = torch.argmax(output.start_logits)
  answer_end = torch.argmax(output.end_logits) + 1
  answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end]))
  answer = answer.replace(' ', '')
  return answer