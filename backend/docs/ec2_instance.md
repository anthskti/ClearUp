## Login to Ubuntu Server

```bash
ssh -i /Users/anthonypham/.ssh/east-2-anth-mac.pem ubuntu@3.141.58.66
```


## Push to Ubuntu Server
If on /clearup/
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' --exclude 'dist' \
-e "ssh -i /Users/anthonypham/.ssh/east-2-anth-mac.pem" \
./backend/ ubuntu@ec2-18-118-133-233.us-east-2.compute.amazonaws.com:~/app
```

If on /clearup/backend/
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' --exclude 'dist' \
-e "ssh -i /Users/anthonypham/.ssh/east-2-anth-mac.pem" \
. ubuntu@ec2-18-118-133-233.us-east-2.compute.amazonaws.com:~/app
```

Check what is uploaded before (kinda like git status)
```bash
rsync -avz --dry-run --exclude 'node_modules' --exclude '.git' --exclude '.env' --exclude 'dist' \
-e "ssh -i /Users/anthonypham/.ssh/east-2-anth-mac.pem" \
. ubuntu@ec2-18-118-133-233.us-east-2.compute.amazonaws.com:~/app
```

Says: want to send everything in the directory, in the ec2 instance, with a directory called app.

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