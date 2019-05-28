/*
 * Copyright (c) 2002-2019 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const fs = require('fs')
const file = './package.json'
const npmrc = './.npmrc'
const yarnrc = './.yarnrc'
const registry = 'https://registry.npmjs.org/'
const packageName = '@neo4j/neo4j-browser-canary'

function failExit (msg) {
  console.log('Error. ' + msg)
  process.exit(1)
}

function successExit () {
  console.log('Name change successful.\n')
  process.exit(0)
}

function changeName (name) {
  const data = fs.readFileSync(file)
  try {
    const obj = JSON.parse(data)
    if (!obj.name) {
      throw new Error('No name found in: ' + JSON.stringify(obj, null, 2))
    }
    obj.name = name
    fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n')
  } catch (e) {
    return failExit(e)
  }
}

function setRegistries (registry) {
  const yarnContents = 'registry "' + registry + '"\n'
  const npmContents = 'registry=' + registry + '\n' + 'tag-version-prefix=""\n'

  try {
    fs.writeFileSync(yarnrc, yarnContents)
    fs.writeFileSync(npmrc, npmContents)
  } catch (e) {
    failExit('Could not set registry. ' + e.message)
  }
}

function main () {
  changeName(packageName)
  setRegistries(registry)
  successExit()
}

main()
