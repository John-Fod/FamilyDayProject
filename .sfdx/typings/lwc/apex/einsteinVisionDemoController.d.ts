declare module "@salesforce/apex/einsteinVisionDemoController.initializeData" {
  export default function initializeData(): Promise<any>;
}
declare module "@salesforce/apex/einsteinVisionDemoController.getImageInfo" {
  export default function getImageInfo(param: {imageContentDocumentId: any}): Promise<any>;
}
declare module "@salesforce/apex/einsteinVisionDemoController.callEinsteinAPI" {
  export default function callEinsteinAPI(param: {imageModelId: any, contentVersionId: any, imageData64: any}): Promise<any>;
}
