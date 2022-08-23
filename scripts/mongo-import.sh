# cd ../../data

# Imports the data and wipes the current collections
# Not using --mode upsert fow now because we don't have unique indexes properly set for the collections
mongoimport --db agora --collection genes --jsonArray --drop --file ./rnaseq_differential_expression.json
mongoimport --db agora --collection geneslinks --jsonArray --drop --file ./network.json
mongoimport --db agora --collection geneinfo --jsonArray --drop --file ./gene_info.json
mongoimport --db agora --collection teaminfo --jsonArray --drop --file ./team_info.json
mongoimport --db agora --collection genesproteomics --jsonArray --drop --file ./proteomics.json
mongoimport --db agora --collection genesmetabolomics --jsonArray --drop --file ./metabolomics.json
mongoimport --db agora --collection genesneuropathcorr --jsonArray --drop --file ./neuropath_corr.json
mongoimport --db agora --collection geneexpvalidation --jsonArray --drop --file ./target_exp_validation_harmonized.json
mongoimport --db agora --collection genescoredistribution --jsonArray --drop --file ./distribution_data.json
mongoimport --db agora --collection genesoverallscores --jsonArray --drop --file ./overall_scores.json
mongoimport --db agora --collection rnaboxdistribution --jsonArray --drop --file ./rna_distribution_data.json
mongoimport --db agora --collection proteomicsboxdistribution --jsonArray --drop --file ./proteomics_distribution_data.json
mongoimport --db agora --collection proteomicstmt --jsonArray --drop --file ./proteomics_tmt.json


cd ./team_images
ls -1r *.jpg *.jpeg *.png | while read x; do mongofiles -d agora -v put $x --replace; echo $x; done
