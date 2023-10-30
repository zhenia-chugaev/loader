prepare:
	npm ci
	npx husky install

install:
	npm ci --omit=dev
	npm link

lint:
	npx eslint .

test:
	npm run test

coverage:
	npx jest --coverage --coverage-provider=v8

publish:
	npm publish --dry-run

.PHONY: coverage
