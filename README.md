# SFDX  App

## Dev, Build and Test


## Resources

## CURL COMMANDS FOR CLASSIFICATION API
Create a Dataset -------------------------------------------------------------

curl -X POST -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "data=@__MY_PC__/__MY_DATASETS__/__MY_DATASET__.zip" -F "type=image"  https://api.einstein.ai/v2/vision/datasets/upload


curl -X POST -H "Authorization: Bearer QS35OO5KZ7JS63AZGML6OFYDISS2RSTW3Q57AIAGYHEWAHRKXEG6ZNUPDV64ZQK2MHBJO6SUCFFUWWKX3GWJTJFTSTOPIBKGLLYGOGI" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "data=@familyDayProject/datasets/arashi.zip" -F "type=image"  https://api.einstein.ai/v2/vision/datasets/upload


Get a Dataset ------------------------------------------------------------------

curl -X GET -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" https://api.einstein.ai/v2/vision/datasets/__MY_DATASET_ID


Train a Dataset -----------------------------------------------------------------

curl -X POST -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "name=J League" -F "datasetId=__MY_DATASET__ID" https://api.einstein.ai/v2/vision/train

curl -X POST -H "Authorization: Bearer QS35OO5KZ7JS63AZGML6OFYDISS2RSTW3Q57AIAGYHEWAHRKXEG6ZNUPDV64ZQK2MHBJO6SUCFFUWWKX3GWJTJFTSTOPIBKGLLYGOGI" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "name=Arashi Member" -F "datasetId=1069497" https://api.einstein.ai/v2/vision/train


Get Training Status -------------------------------------------------------------
NOTE: We pass this the modelId, which should have been in the response from the call to train the dataset. We do NOT pass the datasetId

curl -X GET -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" https://api.einstein.ai/v2/vision/train/__MY_MODEL_ID__


curl -X GET -H "Authorization: Bearer QS35OO5KZ7JS63AZGML6OFYDISS2RSTW3Q57AIAGYHEWAHRKXEG6ZNUPDV64ZQK2MHBJO6SUCFFUWWKX3GWJTJFTSTOPIBKGLLYGOGI" -H "Cache-Control: no-cache" https://api.einstein.ai/v2/vision/train/WDPVV4OLCKXFA7HUWZ3B3SOZ54


Predict Image with File -----------------------------------------------------------
NOTE: We do NOT pass the datasetId. Instead, we pass the modelId.

curl -X POST -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "sampleId=Photo Prediction"  -F "sampleContent=@MyComputer/MyFolder/MyFile.jpg" -F "modelId=__MY_MODEL_ID__" https://api.einstein.ai/v2/vision/predict

## CURL COMMANDS FOR DETECTION API

## Description of Files and Directories
1069498
WDPVV4OLCKXFA7HUWZ3B3SOZ54

## Issues


