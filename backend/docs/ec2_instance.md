## Login to Ubuntu Server

```bash
ssh -i /Users/anthonypham/.ssh/east-2-anth-mac.pem ubuntu@3.141.58.66
```


## Pull Github to Ubuntu Server

```bash
cd app/backend
git pull origin main

```

# If any pulls, need to bun install and build, dist.js
```bash
bun install
bun run build
```

## Run Backend
```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp.service
sudo systemctl start myapp.service
```

## Verify that the service is running properly.
```bash
sudo systemctl status myapp.service
```

## Restart Backend
```bash
sudo systemctl restart myapp.service
```


## Run Service / Restart Caddy

```bash
sudo systemctl daemon-reload
sudo systemctl restart caddy
```

## Logging
```
sudo journalctl -u myapp.service -f -n 50
```

## env information
```bash
sudo vim /etc/app.env
```

Note: its hidden with chmod 600