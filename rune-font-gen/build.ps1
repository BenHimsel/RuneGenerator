function New-RuneExecutable {
    param ()
    if (! (Test-Path ./dist)) {
        mkdir ./dist
    }
    & npx caxa -i . --output "./dist/rune-font-gen.exe" "{{caxa}}/node_modules/.bin/node" "{{caxa}}/main.mjs"
}
