declare module "@apex/einsteinVisionDemoController.initializeData" {
  export function initializeData(): Promise<any>;
}
declare module "@apex/einsteinVisionDemoController.getImageInfo" {
  export function getImageInfo(param: {imageContentDocumentId: any}): Promise<any>;
}
declare module "@apex/einsteinVisionDemoController.callEinsteinAPI" {
  export function callEinsteinAPI(param: {imageModelId: any, contentVersionId: any}): Promise<any>;
}
