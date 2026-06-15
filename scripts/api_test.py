import requests
import json

# Quick prototype script to verify NASA Image Library API payload structure
def test_nasa_api():
    url = "https://images-api.nasa.gov/search"
    params = {
        "q": "curiosity mars rover selfie",
        "media_type": "image",
        "page_size": 2
    }
    
    print("Sending request to NASA Image API...")
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        items = data.get("collection", {}).get("items", [])
        
        # Pretty print the first item's metadata structure to map JS fields
        if items:
            print("\nSuccessfully fetched prototype data. Example item structure:")
            print(json.dumps(items[0], indent=2))
        else:
            print("No items returned.")
    else:
        print(f"Failed to fetch data: {response.status_code}")

if __name__ == "__main__":
    test_nasa_api()
