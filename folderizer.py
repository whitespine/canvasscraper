import pyperclip
import os

FILE_SEP = ";FSEP;"
ELT_SEP = ";ESEP;"
PATH_SEP = ";PSEP;"

INPUT_FOLDER = "download_zone"
OUTPUT_FOLDER = "output"

# Get the manifest
manifest = pyperclip.paste()

# Check that clipboard is valid
if ELT_SEP not in manifest:
    print("You messed up clipboard. Go back to canvas files and it should fix itself")
    exit(1)

# Start splitting
file_entries = manifest.split(FILE_SEP)
file_entries = [f.split(ELT_SEP) for f in file_entries]

# Convert to dict
file_entry_dict = {}
for full_path, auto_name, indiv_name in file_entries:
    # Perform rudimentary sanitation
    for bad in ["//", "/", "..", ".", '\\\\', '\\']:
        full_path = full_path.replace(bad, "_")

    # Make the path a proper path
    full_path = full_path.split(PATH_SEP)
    full_path = [p.strip() for p in full_path]
    dir_path = os.path.join(OUTPUT_FOLDER, *full_path[:-1])
    try:
        os.makedirs(dir_path)
    except OSError as e:
        if "already exists" not in str(e):
            print("Failed to create {}".format(dir_path)) # Doesn't matter
            print(e)

    # Find the file we're currently looking at
    success = False
    for candidate in os.listdir(INPUT_FOLDER):
        if auto_name in candidate:
            # That's our mark!
            os.rename(os.path.join(INPUT_FOLDER, candidate), os.path.join(dir_path, indiv_name))
            success = True
            break

    if not success:
        # print("Could not find {} in {}".format(auto_name, INPUT_FOLDER))
        pass

print("Done")
