$versions = @('v1','v2');
# todo - add support for dynamically loading version numbers from endpoint
$versions | %{
  $v = $_
  & npx swagger-typescript-api --path https://api.internal.dev.pangea.io/api/$v/schema/ --clean-output --extract-request-params --output lib/api/$v/ --type-prefix Pangea --modular --axios --clean-output
  Remove-Item "lib/api/$v/http-client.ts" -Force
  & npx prettier --write lib/api/$v/*.ts
  & npx replace-in-file --configFile=replaceNullEnum.config.js
  #todo - update index.ts barrel file
}
