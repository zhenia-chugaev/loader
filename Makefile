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

publish:
	npm publish --dry-run
