# canvasscraper

Automatically downloads files from canvas. Download with generic names

TO USE:

1. Clone this git repostitory. Through some method acquire python with pyperclip.
2. Install a userscript engine for your preferred browser. For chrome/firefox, I recommend tampermonkey. 
3. Add the provided userscript. Now, whenever you go to the files portion of canvas, it will try to download everything it sees at least once.
4. In tampermonkey settings, whitelist any filetypes you want. Most will want .pdf and .docx. Maybe also pptx idk. Do it here

![Get to settings](https://i.imgur.com/15NDblA.png)

![Add to whitelist](https://i.imgur.com/CqKGk6A.png)

5. WHEN PROMPTED TO DOWNLOAD, SAVE TO THE canvasscraper/download_zone FOLDER!
6. Keep slamming that save button, clicking through all the files you can find/want to upload. If something is super huge, just cancel the download and move on.
7. When you've got all the files you want, run the python script. It will reconstruct the canvas directory structure as best it can.
8. Add each class folder to the appropriate location in the drive.


Not exactly the most user friendly thing but whatever.
