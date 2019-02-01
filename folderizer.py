import pyperclip
import os

FILE_SEP = ";FSEP;"
ELT_SEP = ";ESEP;"
PATH_SEP = ";PSEP;"

# Get the manifest
manifest = pyperclip.paste()
file_entries = manifest.split(FILE_SEP)
file_entries = [f.split(ELT_SEP) for f in file_entries]

# Convert to dict
file_entry_dict = {}
for full_path, auto_name, indiv_name in file_entries:
    # Make the path a proper path
    dir_path = full_path.split(PATH_SEP)[:-1].join(os.path.sep)
    try:
        os.mkdir(dir_path)
    except OSError:
        pass # Doesn't matter

    # Find the file we're currently looking at
    for candidate in os.listdir(os.getcwd()):
        if auto_name in candidate:
            # That's our mark!
            os.rename(candidate, os.path.join(dir_path, indiv_name))
            break


