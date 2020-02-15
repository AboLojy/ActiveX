


declare var $: any;
declare var jQuery: any;


function _try(func, fallbackValue) {
    try {
        var value = func();
        return (value === null || value === undefined) ? fallbackValue : value;
    } catch (e) {
        return fallbackValue;
    }
}
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };


function createCDATASection(text: string, elem?: any) {
    var xmlObj;
    if (elem === undefined || elem === null) {
        xmlObj = this;
    } else {
        xmlObj = elem;
    }
    return xmlObj.ownerDocument.createCDATASection(text);
}



function removeFirstLastTextNodesFromDocument(xmlDocument: any) {
    if (xmlDocument.childNodes.length > 0) {
        // Text node
        if (xmlDocument.childNodes[0].nodeType == 3) {
            xmlDocument.childNodes[0].remove();
        }
        if (xmlDocument.childNodes.length > 0 &&
            xmlDocument.childNodes[xmlDocument.childNodes.length - 1].nodeType == 3) {
            xmlDocument.childNodes[xmlDocument.childNodes.length - 1].remove();
        }
    }
}


Object.defineProperty(Node.prototype, "selectSingleNode", {
    value(xPath) {
        var self = this;

        return selectSingleNode(xPath, self);
    },

    enumerable: false
});

Object.defineProperty(Node.prototype, "selectNodes", {
    value(xPath) {
        var self = this;
        return selectNodes(xPath, self);
    },
    enumerable: true
});

function selectNodes(xPath, elem?: any) {
    var xmlObj;
    if (elem === undefined || elem === null) {
        xmlObj = this;
    } else {
        xmlObj = elem;
    }
    var nodes: any = [];


    xPath = xPath.replace(/ && /g, " and ");
    nodes = $(xmlObj).xpath(xPath);


    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        applyCustomAttributes(node);
    }
    nodes.currNode = 0;
    nodes.nextNode = () => {
        if (nodes.currNode >= nodes.length) {
            return false;
        }
        else {
            return nodes[nodes.currNode++];
        }
    };
    nodes.item = i => nodes[i];

    return nodes;
};

function selectSingleNode(xPath, elem?: any) {

    var xmlObj;
    if (elem === undefined || elem === null) {
        xmlObj = this;
    } else {
        xmlObj = elem;
    }
    var node = null;

    xPath = xPath.replace(/ && /g, " and ");
    var nodes = $(xmlObj).xpath(xPath); // need jQuery
    if (nodes !== undefined && nodes !== null && nodes.length > 0) {
        node = nodes[0];
        applyCustomAttributes(node);
    }
    return node;
}

function createXMLElement(elemName, elem?: any) {
    var xmlObj;
    if (elem === undefined || elem === null) {
        xmlObj = this;
    } else {
        xmlObj = elem;
    }
    var newElem = xmlObj.ownerDocument.createElement(elemName);
    applyCustomAttributes(newElem);
    return newElem;
}

function appendXMLChild(elemName, elem?: any) {
    var xmlObj;
    if (elem === undefined || elem === null) {
        xmlObj = this;
    } else {
        xmlObj = elem;
    }
    var newElem = xmlObj.ownerDocument.appendChild(elemName);
    applyCustomAttributes(newElem);
    return newElem;
}

function removeXMLChild(elemName, elem?: any) {
    var xmlObj;
    if (elem === undefined || elem === null) {
        xmlObj = this;
    } else {
        xmlObj = elem;
    }
    var newElem = xmlObj.ownerDocument.removeChild(elemName);
    applyCustomAttributes(newElem);
    return newElem;
}

function getMatchedXMLElementName(xmlDocStr: string): any {
    var myRegexp = /<xml id=\"(\w+)\"/g;
    var match = myRegexp.exec(xmlDocStr);
    if (match !== null) {
        return match[1];
    }
    return null;
}

function getXMLRawString(xmlDocStr: string, matchedXMLElementName: string): string {
    var xmlScriptID = document.getElementById(`${matchedXMLElementName}Script`);
    var xmlRawString;
    if (xmlScriptID == undefined || xmlScriptID == null) {
        xmlRawString = xmlDocStr;
    } else {
        xmlRawString = xmlScriptID.innerHTML;
    }
    return xmlRawString;
}

class XMLObject {
    protected xmlParser;
    protected documentElement;
    protected parsedXMLDoc;
    protected xmlElem;
    protected xmlString;

    constructor() {

        this.xmlParser = new (<any>window).DOMParser();
    }

    public selectNodes(xPath: string): any {
        return selectNodes(xPath, this.parsedXMLDoc);
    }

    public selectSingleNode(xPath: string): any {
        return selectSingleNode(xPath, this.parsedXMLDoc);
    }

    public createElement(elemName: string): any {
        return createXMLElement(elemName, this.documentElement);
    }

    public createCDATASection(text: string): CDATASection {
        return createCDATASection(text, this.documentElement);
    }

    public loadXML(xmlDocStr): any {
        //xmlDocStr is ignored as if it get parsed it will fail to parse
        var matchedXMLElementName = getMatchedXMLElementName(xmlDocStr);
        var xmlRawString = getXMLRawString(xmlDocStr, matchedXMLElementName);
        this.xmlElem = undefined;
        if (matchedXMLElementName !== undefined && matchedXMLElementName !== null) {
            this.xmlElem = document.getElementById(matchedXMLElementName);
            this.xmlElem.innerHTML = xmlRawString;
        } else {
            this.xmlElem = this;
        }
        this.xmlString = xmlRawString;
        var xmlObj = this.xmlParser.parseFromString(this.xmlString, "application/xml");
        this.parsedXMLDoc = xmlObj;
        this.documentElement = this.parsedXMLDoc.documentElement;
        removeFirstLastTextNodesFromDocument(this.documentElement);
        if (this.documentElement.selectNodes == undefined) {
            this.documentElement.selectNodes = xPath => selectNodes(xPath, xmlObj);
        }
        if (this.documentElement.selectSingleNode == undefined) {
            this.documentElement.selectSingleNode = xPath => selectSingleNode(xPath, xmlObj)
        }
        if (this.documentElement.createElement == undefined) {
            this.documentElement.createElement = function (elemName) {
                return createXMLElement(elemName, this.documentElement);
            }
        }
        if (this.documentElement.createCDATASection == undefined) {
            this.documentElement.createCDATASection = function (text) {
                return createCDATASection(text, this.documentElement);
            }
        }
        this.documentElement.xml = this.documentElement;
        return this.documentElement;
    }
    public loadEx(url: string): any {
        url = url.replace("http://", "https://");
        var xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP.4.0");
        xmlHTTP.open("GET", url, false);
        xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHTTP.send("");
        return (new DOMParser()).parseFromString(xmlHTTP.responseText, "text/xml");
 
    }
    public load(url: string): any {
        url = url.replace("http://", "https://");
        var xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP.4.0");
        xmlHTTP.open("GET", url, false);
        xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHTTP.send("");

        this.xmlString = xmlHTTP.responseText;
        this.parsedXMLDoc = xmlHTTP.responseXML;
        this.documentElement = this.parsedXMLDoc.documentElement;
        removeFirstLastTextNodesFromDocument(this.documentElement);
        this.xmlElem = this;
        var xmlObj = this.parsedXMLDoc;
        if (this.documentElement.selectNodes == undefined) {
            this.documentElement.selectNodes = xPath => selectNodes(xPath, xmlObj);
        }
        if (this.documentElement.selectSingleNode == undefined) {
            this.documentElement.selectSingleNode = xPath => selectSingleNode(xPath, xmlObj)
        }
        if (this.documentElement.createElement == undefined) {
            this.documentElement.createElement = function (elemName) {
                return createXMLElement(elemName, this.documentElement);
            }
        }
        if (this.documentElement.createCDATASection == undefined) {
            this.documentElement.createCDATASection = function (text) {
                return createCDATASection(text, this.documentElement);
            }
        }
        this.documentElement.xml = this.documentElement;
        return this.documentElement;

    }

    public transformNode(xslElem: any): string {
        var self = this;
        var xsltProcessor = new (<any>window).XSLTProcessor();
        xsltProcessor.importStylesheet(xslElem.documentElement);
        var resultDocument = xsltProcessor.transformToFragment(self.documentElement, document);
        var xmlSerializer = new XMLSerializer();
        var sXMLString = xmlSerializer.serializeToString(resultDocument);
        return sXMLString;
    }
}

function parseXMLTags() {
    var xmlElements = document.getElementsByTagName("XML");
    if (xmlElements.length > 0) {
        for (var i = 0; i < xmlElements.length; i++) {
            var elem: any = xmlElements[i];
            var xmlDocStr = elem.outerHTML;
            var matchedXMLElementName = getMatchedXMLElementName(xmlDocStr);
            var xmlRawString = getXMLRawString(xmlDocStr, matchedXMLElementName);
            var xmlParser = new (<any>window).DOMParser();
            var xmlObj = xmlParser.parseFromString(xmlRawString, "text/xml");
            xmlObj.documentElement.selectNodes = function (xPath) {
                return selectNodes(xPath, this);
            };
            xmlObj.documentElement.selectSingleNode = function (xPath) {
                return selectSingleNode(xPath, this);
            }

            elem.removeChild = function (xElem) {

                try {
                    xmlObj.removeChild(xElem);
                } catch (e) {
                    xmlObj.documentElement.removeChild(xElem);
                }
               
            }
            elem.selectNodes = function (xPath) {
                return selectNodes(xPath, xmlObj.documentElement);
            };
            elem.selectSingleNode = function (xPath) {
                return selectSingleNode(xPath, xmlObj.documentElement);
            }
            elem.createElement = function (elemName) {
                var newElem = xmlObj.createElement(elemName);
                applyCustomAttributes(newElem);
                return newElem;

            }
            elem.appendChild = function (elemName) {
                xmlObj.appendChild(elemName);

            }
            removeFirstLastTextNodesFromDocument(xmlObj.documentElement);
            elem.documentElement = xmlObj.documentElement;

        }
    }
}

function getAttributeCustom(attrName, elem?: any) {
    var element;
    if (elem === undefined || elem === null) {
        element = this;
    } else {
        element = elem;
    }
    var nodes: any = [];
    var attrVal = null;
    var attributes = element.attributes;
    var attrNameLower = attrName.toLowerCase();
    for (var k = 0; k < attributes.length; k++) {
        var attr = attributes[k];
        if (attrNameLower === attr.name.toLowerCase()) {
            attrVal = attr.value;
            break;
        }
    }
    return attrVal;
}



function applyCustomAttributes(node) {
    node.getAttribute = getAttributeCustom;
    //node["firstChild"] = node.firstElementChild;
}