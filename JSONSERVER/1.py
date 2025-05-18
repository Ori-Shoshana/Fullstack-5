import json

# נתיב לקובץ שלך
DB_PATH = 'C:/Users/212or/OneDrive/שולחן העבודה/Fullstack-5/JSONSERVER/db.json'

# מספר התמונות שברצונך לעדכן
MAX_PHOTOS = 1000

# פתיחת הקובץ
with open(DB_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# בדיקה שיש קטע photos
if 'photos' not in data:
    print("Missing 'photos' in db.json")
    exit()

# עדכון הכתובות
for i, photo in enumerate(data['photos']):
    if i >= MAX_PHOTOS:
        break

    photo_id = i + 1  # ids מתחילים מ־1
    photo['url'] = f'https://picsum.photos/id/{photo_id}/600/400'
    photo['thumbnailUrl'] = f'https://picsum.photos/id/{photo_id}/300/200'

# שמירה חזרה לקובץ
with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f'Updated {min(len(data["photos"]), MAX_PHOTOS)} photo entries with picsum URLs.')
