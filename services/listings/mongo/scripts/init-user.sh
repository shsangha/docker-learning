echo 'Creating application user and db'

mongo admin \
        --host localhost \
        --port 27017 \
        -u root \
        -p root\
        --authenticationDatabase admin \
        --eval "db.createUser({user: 'shawn', pwd: 'shawn', roles:[
                {role: 'dbOwner', db: 'grailed'},
                {role: 'dbAdmin', db: 'local'}
        ]});"
