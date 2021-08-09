import { StorageService } from "./StorageService";
export interface LocalStorageServiceInstance {
}
export interface LocalStorageServiceStatic extends StorageService {
    new (): LocalStorageServiceInstance;
}
declare const LocalStorage: LocalStorageServiceStatic;
export default LocalStorage;
