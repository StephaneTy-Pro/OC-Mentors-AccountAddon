// ------ MISC
// found in stackoverflow to add an element first waiting full implementation of appendFirst in DOM
// NOTE STT ai essayé le elese fonctionne bien comme prévu comme cela
HTMLElement.prototype.appendFirst=function(childNode){
    if(this.firstChild)this.insertBefore(childNode,this.firstChild);
    else this.appendChild(childNode);
};
