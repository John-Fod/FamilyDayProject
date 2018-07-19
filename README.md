# SFDX  App

## Dev, Build and Test


## Resources

## CURL COMMANDS
Create a Dataset -------------------------------------------------------------

curl -X POST -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "data=@__MY_PC__/__MY_DATASETS__/__MY_DATASET__.zip" -F "type=image"  https://api.einstein.ai/v2/vision/datasets/upload


Get a Dataset ------------------------------------------------------------------

curl -X GET -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" https://api.einstein.ai/v2/vision/datasets/__MY_DATASET_ID


Train a Dataset -----------------------------------------------------------------

curl -X POST -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "name=J League" -F "datasetId=__MY_DATASET__ID" https://api.einstein.ai/v2/vision/train


Get Training Status -------------------------------------------------------------
NOTE: We pass this the modelId, which should have been in the response from the call to train the dataset. We do NOT pass the datasetId

curl -X GET -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" https://api.einstein.ai/v2/vision/train/__MY_MODEL_ID__


Predict Image with File -----------------------------------------------------------
NOTE: We do NOT pass the datasetId. Instead, we pass the modelId.

curl -X POST -H "Authorization: Bearer __MY_TOKEN__" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "sampleId=Photo Prediction"  -F "sampleContent=@MyComputer/MyFolder/MyFile.jpg" -F "modelId=__MY_MODEL_ID__" https://api.einstein.ai/v2/vision/predict

## Description of Files and Directories


## Issues


