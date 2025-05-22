import json

# נתיב לקובץ שלך (תעדכן לפי הצורך)
DB_PATH = 'JSONSERVER/db.json'


# מיפוי של השדות שצריך להמיר לכל סוג של אובייקט
FIELDS_TO_CONVERT = {
    'users': ['id'],
    'albums': ['id', 'userId'],
    'posts': ['id', 'userId'],
    'todos': ['id', 'userId'],
    'photos': ['id', 'albumId'],
    'comments': ['id', 'postId']
}

def convert_fields(obj, fields):
    for field in fields:
        if field in obj:
            try:
                obj[field] = int(obj[field])
            except (ValueError, TypeError):
                print(f"שדה לא ניתן להמרה במספר: {field} = {obj.get(field)}")

# קריאה מהקובץ
with open(DB_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# מעבר על כל המשאבים המוגדרים
for resource, fields in FIELDS_TO_CONVERT.items():
    if resource in data:
        for item in data[resource]:
            convert_fields(item, fields)

# כתיבה חזרה לקובץ
with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ סיום: כל השדות הומרו למספרים במידת הצורך.")
