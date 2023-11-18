### Tests and linter status:
[![node CI](https://github.com/zhenia-chugaev/loader/actions/workflows/node-ci.yml/badge.svg)](https://github.com/zhenia-chugaev/loader/actions/workflows/node-ci.yml)
[![Actions Status](https://github.com/anorone/backend-project-4/workflows/hexlet-check/badge.svg)](https://github.com/anorone/backend-project-4/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/291ad53d96bed51702bf/maintainability)](https://codeclimate.com/github/zhenia-chugaev/loader/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/291ad53d96bed51702bf/test_coverage)](https://codeclimate.com/github/zhenia-chugaev/loader/test_coverage)

## Description
The utility gets page url and output directory as parameters, downloads the page and saves it locally for the offline use.

## Demo
[![asciicast](https://asciinema.org/a/621718.svg)](https://asciinema.org/a/621718)

## Installation & Usage
Clone the repo.
Run commands:
```shell
$ cd <project folder>
$ make install
```
From now on there will be `page-loader` command available in the global scope.
```shell
# Run to see the help page
$ page-loader --help
```
To prepare the package for working in the _develpment mode_ do the following:
```shell
$ make prepare
```

## Tests
This command runs the tests:
```shell
$ make test
```

## Uninstallation
The package installation using instructions above links the package to the global scope of your computer just like `npm link` command does. To remove it you can run the following:
```shell
$ make uninstall
```
