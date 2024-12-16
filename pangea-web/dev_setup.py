import subprocess

def add_env_local():
  try:
     f = open(".env.local","x+")
     f.write("USE_SECURE_COOKIES=FALSE\nNEXT_PUBLIC_PANGEA_API_URL=https://api.dev.pangea.io");
     f.close()
  except FileExistsError:
    print('.env.local file already exists. Won\'t override.')

def add_secrets_json():
  try:
    f = open("secrets.json", "x+")
    print("Enter Pangea.io account username:")
    username = input()
    print("Enter Pangea.io account password:")
    password = input()
    f.write(f"{{\"pangea\": {{ \"username\": \"{username}\", \"password\": \"{password}\"}}}}")
    f.close()
  except FileExistsError:
    print('secrets.json file already exists. Won\'t override.')

def fix_swagger_typescript_api():
  try:
    filePath ='node_modules\\swagger-typescript-api\\src\\formatFileContent.js'
    with open(filePath,'r') as f:
      lines=f.readlines()
    for line in lines:
      if line.find("fileExists(file) {") > 0:
        print('File already modified.')
        return

    lineToInsert = 0
    iLine = 0
    for line in lines:
      iLine+=1
      if line.find("getNewLine() {") > 0:
        lineToInsert = iLine
        break

    if lineToInsert == 0:
      return

    lines.insert(lineToInsert-1, "  fileExists(file) { return ts.sys.fileExists(file); }\r\n")
    with open(filePath,'w+') as f:
      f.write("".join(lines))

  except FileNotFoundError:
    print('Couldn''t open formatFileContent.js file.')

def main():
  add_env_local()
  add_secrets_json()
  npmProc = subprocess.run(['npm','i'],capture_output=False,shell=True,stdout=subprocess.PIPE)
  npmProc.check_returncode()
  fix_swagger_typescript_api()

if __name__== "__main__":
  main()
