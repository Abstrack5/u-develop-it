# u-develop-it

npm install config
setup config/ folder
with {
  "server": {
      "user": "<Your User Name (root is the default)>,
      "password": "<Your Password>"
  }
}
  
call by:
 const user = config.get('server.user')
const pw = config.get('server.password')
  
  hide in gitignore
