export class Toast {

    private message : string;
    private type : ToastType;
    private time : number;
    private parentElement : HTMLElement;

    private messageElement : HTMLElement;
    
    private closeDiv : HTMLElement;

    constructor(message : string, type : ToastType, time : number, container : HTMLUListElement){
        this.message = message;
        this.type = type;
        this.time = time;
        this.parentElement = document.createElement('li');
        this.parentElement.classList.add("toast-notification");
        this.parentElement.classList.add(this.type);
        
        this.messageElement = document.createElement("div");
        this.messageElement.className = "toast-message-container";
        this.messageElement.textContent = this.message;
        
        this.parentElement.appendChild(this.messageElement);
        
        this.closeDiv = document.createElement("div");
        this.closeDiv.className = "toast-close-notification";
        this.closeDiv.textContent = "╳";
        
        this.parentElement.append(this.closeDiv);
        
        container.appendChild(this.parentElement);
        
        setTimeout(this.remove, this.time);
        
        this.closeDiv.addEventListener("click", this.remove);
    }

    private remove = () => {
        this.parentElement.remove();
    }
    
}

export const enum ToastType {
    Success = "success",
    Error = "error",
}