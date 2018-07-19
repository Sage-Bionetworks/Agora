cd ../data

# Imports the data and wipes the current collections
# Not using --mode upsert fow now because we don't have unique indexes properly set for the collections
mongoimport --db agora --collection genes --jsonArray --drop --file ./rnaseq_differential_expression.json
mongoimport --db agora --collection geneslinks --jsonArray --drop --file ./network.json
mongoimport --db agora --collection geneinfo --jsonArray --drop --file ./gene_info.json
mongoimport --db agora --collection teaminfo --jsonArray --drop --file ./team_info.json

cd ./team_images
ls -1r *.jpg | while read x; do mongofiles -d agora -v put $x --replace; echo $x; done
