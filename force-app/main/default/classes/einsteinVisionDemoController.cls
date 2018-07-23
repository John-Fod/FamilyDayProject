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



    @AuraEnabled public static List<Vision.Prediction> callEinsteinAPI(String imageModelId, String contentVersionId, String imageData64){
        String access_token = getAccessToken();
        System.debug('access_token : ' + access_token);
        // ContentVersion content = [SELECT Title,VersionData FROM ContentVersion WHERE Id = :contentVersionId LIMIT 1];
        // return Vision.predictBlob(content.VersionData, access_token, imageModelId);
        return Vision.predictBlob(EncodingUtil.base64Decode(imageData64), access_token, imageModelId);
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
