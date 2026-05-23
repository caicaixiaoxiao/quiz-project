"""
为咖啡性格测验生成三张白底产品图。
输出到 public/ 文件夹，统一 1024x1024 正方形。
"""

import os
import sys
import urllib.request
from http import HTTPStatus
from pathlib import Path
from dotenv import load_dotenv

# 从 nano-banana 目录加载 DASHSCOPE_API_KEY
env_path = Path(__file__).parent.parent / "course-materials/lesson-modules/3-nano-banana/.env"
load_dotenv(dotenv_path=env_path)

import dashscope
from dashscope import ImageSynthesis

dashscope.api_key = os.environ.get("DASHSCOPE_API_KEY")
if not dashscope.api_key:
    print("错误：找不到 DASHSCOPE_API_KEY")
    sys.exit(1)

OUTPUT_DIR = Path(__file__).parent / "public"
OUTPUT_DIR.mkdir(exist_ok=True)

# 固定风格前缀：45° 斜俯角，与 mocha 保持一致
STYLE_PREFIX = (
    "product photography, pure white background, professional studio lighting, "
    "45-degree angle slightly elevated three-quarter view, can see both the top and side of the cup, "
    "minimalist, clean, soft shadow, square format, "
    "high resolution commercial coffee photo"
)

IMAGES = [
    {
        "filename": "espresso.jpg",
        "prompt": f"{STYLE_PREFIX}, double espresso shot in small white ceramic cup, rich golden crema on top, dark roast",
        "label": "大胆冒险者 - 双份浓缩",
    },
    {
        "filename": "drip-coffee.jpg",
        "prompt": f"{STYLE_PREFIX}, medium roast drip coffee in white ceramic mug, warm brown color, simple classic",
        "label": "温暖守旧派 - 滴滤咖啡",
    },
]

def generate_image(prompt: str, output_path: Path, label: str):
    print(f"\n生成中：{label}")
    rsp = ImageSynthesis.call(
        model="wanx2.1-t2i-plus",
        prompt=prompt,
        n=1,
        size="1024*1024",
    )
    if rsp.status_code != HTTPStatus.OK:
        print(f"  失败：{rsp.code} - {rsp.message}")
        return False

    output = rsp.output or {}
    task_status = getattr(output, "task_status", None) or output.get("task_status")
    results = getattr(output, "results", None) or output.get("results") or []

    if task_status != "SUCCEEDED" or not results:
        code = getattr(output, "code", None) or output.get("code")
        msg = getattr(output, "message", None) or output.get("message")
        print(f"  失败：task_status={task_status}, {code} - {msg}")
        return False

    first = results[0]
    img_url = getattr(first, "url", None) or first.get("url")
    urllib.request.urlretrieve(img_url, str(output_path))
    print(f"  已保存 -> {output_path.name}")
    return True

if __name__ == "__main__":
    print("=== 重新生成前两张（调整为 45 度斜俯角）===")
    ok = 0
    for item in IMAGES:
        out = OUTPUT_DIR / item["filename"]
        if generate_image(item["prompt"], out, item["label"]):
            ok += 1
    print(f"\n完成：{ok}/{len(IMAGES)} 张生成成功")
    print(f"图片位于：{OUTPUT_DIR}")
