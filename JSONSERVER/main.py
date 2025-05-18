import json

# Load your JSON (example shown as string; replace with file read if needed)
with open('C:\\Users\\212or\\OneDrive\\שולחן העבודה\\Fullstack-5\\JSONSERVER\\db.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update URLs
for photo in data["photos"]:
    photo_id = photo["id"]
    new_url = f"images/{photo_id}.jpg"
    photo["url"] = new_url
    photo["thumbnailUrl"] = new_url  # or change to something else like images/thumbs/{photo_id}.jpg if needed

# Save updated JSON
with open('updated_photos.json', 'w') as f:
    json.dump(data, f, indent=2)
