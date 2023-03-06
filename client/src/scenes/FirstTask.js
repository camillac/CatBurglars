export default class FirstTask extends Phaser.Scene {
    constructor() {
        super({FirstTask});
        this.state = {};
        this.hasBeenSet = false; 
    }
    init(data) {
        this.socket = data.socket;
    }
    preload() {}
    
    create() { }

    upload(){}

}