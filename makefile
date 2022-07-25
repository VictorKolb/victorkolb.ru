up-prod:
	docker-compose up -d --build --remove-orphans

down-prod:
	docker-compose down

fix-cert:
	make down-prod
	bash init-letsencrypt.sh
	make up-prod

deploy:
	rsync -av -e ssh --exclude="node_modules" --exclude=".git" --exclude=".idea" --exclude=".DS_Store" ./ root@194.67.113.155:/root/victorkolb



