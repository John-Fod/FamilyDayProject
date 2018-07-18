public with sharing class einsteinVisionDemoController {
    public einsteinVisionDemoController() {

    }

    @AuraEnabled public static String initializeData(){
        Map<String,Object> returnMap = new Map<String,Object>();
        List<Einstien_Dataset__c> einsteinDatasets = [
            SELECT ID, Name, DatasetId__c, (SELECT ModelID__c FROM Image_Models__r) FROM Einstien_Dataset__c
        ];
        returnMap.put('einsteinDatasets', einsteinDatasets);
        returnMap.put('userId',UserInfo.getUserId());

        return JSON.serialize(returnMap);
    }

    @AuraEnabled public static Map<String,Object> getImageInfo(Id imageContentDocumentId){
        Map<String,Object> imageInfoMap = new Map<String,Object>();
        ContentDocument cDoc = [
            SELECT Id, LatestPublishedVersionId
            FROM ContentDocument
            WHERE ID = :imageContentDocumentId
            LIMIT 1
        ];
        ContentVersion cVer = [
            SELECT Id, PathOnClient, VersionData, FileExtension, ContentDocumentId
            FROM ContentVersion
            WHERE Id = :cDoc.LatestPublishedVersionId
            LIMIT 1
        ];
        imageInfoMap.put('versionData', EncodingUtil.base64Encode(cVer.VersionData));
        imageInfoMap.put('fileExtension', cVer.FileExtension);
        imageInfoMap.put('pathOnClient', cVer.PathOnClient);
        imageInfoMap.put('contentDocumentId', imageContentDocumentId);
        imageInfoMap.put('contentVersionId', cDoc.LatestPublishedVersionId);
        return imageInfoMap;
    }



    @AuraEnabled public static List<Vision.Prediction> callEinsteinAPI(String imageModelId, String contentVersionId){
        String access_token = getAccessToken();
        System.debug('access_token : ' + access_token);
        ContentVersion content = [SELECT Title,VersionData FROM ContentVersion WHERE Id = :contentVersionId LIMIT 1];
        return Vision.predictBlob(content.VersionData, access_token, imageModelId);
        //ContentVersion content = [SELECT Title,VersionData FROM ContentVersion WHERE Id =
        // return Vision.predictBlob(Blob.valueOf(versionData), access_token, 'GeneralImageClassifier');
        // String modelName = [SELECT Id, ModelId__c, Name FROM Image_Model__c WHERE ModelId__c = :imageModelId LIMIT 1].Name;
        // return Vision.predictBlob(Blob.valueOf(versionData), access_token, 'GeneralImageClassifier');
        // return Vision.predictBlob(Blob.valueOf(versionData), access_token, modelName);



    /* THE PROBLEM IS THAT WE NEED TO SEND A FORM, NOT JUST JSON */
    /*
        String token = 'NELWC7DLGDP2NXS3O3624MDWTDA3UFXZIRZZOBOYTTMAL33PEO5Q4PFJR4T5525NEMEU57WYCEKDTPL7I457ZL7KUK3T5NJ7GTLBPTQ';
        Map<String,Object> reqBodyMap = new Map<String,Object>();
        reqBodyMap.put('modelId',imageModelId);
        reqBodyMap.put('sampleBase64Content',versionData);
        System.debug('modelId : ' + imageModelId);
        System.debug('versionData : ' + versionData);

        HTTPRequest req = new HTTPRequest();
        req.setMethod('POST');
        req.setHeader('Authorization', 'Bearer ' + token);
        req.setHeader('Content-Type', 'multipart/form-data');
        req.setHeader('Cache-Control', 'no-cache');
        req.setEndpoint('https://api.einstein.ai/v2/vision/predict');
        //req.setBody(JSON.serialize(reqBodyMap));
        req.setBody('{"modelId":"' + imageModelId + '", "sampleBase64Content":"' + versionData + '"}');
        req.setTimeout(30000);
        HTTP http = new HTTP();
        HTTPResponse res = http.send(req);
        Map<String,Object> resBodyMap = (Map<String,Object>)JSON.deserializeUntyped(res.getBody());
        System.debug('resBodyMap.message : ' + resBodyMap.get('message'));
        System.debug('res : ' + res);
        System.debug('res.getBody : ' + res.getBody());
        System.debug('res.getStatus : ' + res.getStatus());
        System.debug('res.getHeaderKeys : ' + res.getHeaderKeys());
        return res.getBody();
    */

    }

    public static String getAccessToken(){
        ContentVersion base64Content = [SELECT Title, VersionData FROM ContentVersion WHERE Title='einstein_platform' OR Title='predictive_services' ORDER BY Title LIMIT 1];
        // System.debug('keyContents : ' + base64Content.VersionData.toString());
        String keyContents = base64Content.VersionData.toString();
        keyContents = keyContents.replace('-----BEGIN RSA PRIVATE KEY-----','');
        keyContents = keyContents.replace('-----END RSA PRIVATE KEY-----','');
        keyContents = keyContents.replace('\n','');

        //Get a new token
        JWT jwt = new JWT('RS256');
        jwt.pkcs8 = keyContents;
        jwt.iss = 'developer.force.com';
        jwt.sub = 'sft.john.fodrocy@gmail.com';
        jwt.aud = 'https://api.einstein.ai/v2/oauth2/token';
        jwt.exp = '3600';
        String access_token = JWTBearerFlow.getAccessToken('https://api.einstein.ai/v2/oauth2/token',jwt);
        return access_token;
    }
}
