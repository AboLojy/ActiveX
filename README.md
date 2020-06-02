# ActiveX.js
Mimic IE9 ActiveX in a standard javascript library to be able to move your old code as is to run on the modern browsers.
## Features
just transpiler the ts files to a single javascript file the add the reference to your HTML code
```
    <script language="javascript" src="/ActiveX.js"></script>
    <script>
    
    var cnn = new ADOConnection();
    var arr = [];
    var rs = cnn.execute("select * from bla");
    while(rs.EOF){
        arr.push(rs(0));
        rs.next();
    }
    rs.Close();
    
    var xml = new ActiveXObject("MSXML2.DOMDocument.4.0") ;
    xml.load("http://resourceSite/xmlfile.xml")
    var xml = new ActiveXObject("Excel.Application") ;
    ...
```


