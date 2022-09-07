<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <head>
        <title>Sitemap</title>
        <link rel="stylesheet" href="sitemap.css" type="text/css" />
    </head>
  <body>
    <div class="container">
      <table>
        <thead>
          <th><xsl:value-of select="urldata/urlsettitle"/></th>
          <th>Last modified</th>
        </thead>
        <tbody>
          <xsl:for-each select="urldata/urlset/url">
            <tr>
              <td>
                <a href="{loc}"><xsl:value-of select="loc"/></a>
              </td>
              <td>
                <xsl:value-of select="lastmod"/>
              </td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
  </body>
</html>