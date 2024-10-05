import json
from django import template
from django.conf import settings
from pathlib import Path

register = template.Library()

@register.simple_tag
def vite_asset(asset_name):
    """
    Viteのmanifest.jsonを参照して、正しいアセットファイル名を取得する
    """
    manifest_path = Path(settings.BASE_DIR) / 'chatbotapp' / 'static' / 'dist' / 'manifest.json'
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    
    return f"/static/dist/{manifest[asset_name]['file']}"