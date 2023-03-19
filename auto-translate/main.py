import pandas as pd
from tqdm import tqdm
import requests
import time
df = pd.read_csv("./data/data.csv", encoding="utf-8", quoting=1)
print(df)


for i in tqdm(range(4,len(df))):
    url = "http://localhost:55688/translate"
    print(df["source"][i])
    payload = {
        "message": df["source"][i]
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.request("POST", url, headers=headers, json=payload)
    print(response.text)
    result = response.text.replace('\n', '\\n').replace('"', '\\"')
    df.loc[i,"target"] = result
    df.loc[i,"fuzzy"] = True
    time.sleep(5)
    df.to_csv("./data/result.csv", index=False, encoding="utf-8",quoting=1)



