prepare:
	npm ci
	npx husky install

install:
	npm ci --omit=dev
	npm link

lint:
	npx eslint .

publish:
	npm publish --dry-run
