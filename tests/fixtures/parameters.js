// Parameter file fixtures for testing

export const sampleParameterXml = `<?xml version="1.0" encoding="UTF-8"?>
<parameters>
  <alerts>
    <alert filename="PatternAlerts.java">
      <grouping type="HOUSE">
        <parameter name="PARAM_001">
          <values>
            <default>
              <participant type="METAMARKET" C="asx"/>
              <value>
                <list-value>
                  <composite-value>
                    <number-value>9</number-value>
                    <number-value>9</number-value>
                    <number-value>20</number-value>
                    <number-value>100</number-value>
                    <boolean-value>true</boolean-value>
                  </composite-value>
                </list-value>
              </value>
            </default>
          </values>
        </parameter>
        <parameter name="PARAM_002">
          <values>
            <default>
              <participant type="METAMARKET" C="asx"/>
              <value>
                <number-value>500</number-value>
              </value>
            </default>
          </values>
        </parameter>
      </grouping>
    </alert>
  </alerts>
</parameters>`;

export const modifiedParameterXml = `<?xml version="1.0" encoding="UTF-8"?>
<parameters>
  <alerts>
    <alert filename="PatternAlerts.java">
      <grouping type="HOUSE">
        <parameter name="PARAM_001">
          <values>
            <default>
              <participant type="METAMARKET" C="asx"/>
              <value>
                <list-value>
                  <composite-value>
                    <number-value>12</number-value>
                    <number-value>12</number-value>
                    <number-value>25</number-value>
                    <number-value>150</number-value>
                    <boolean-value>true</boolean-value>
                  </composite-value>
                </list-value>
              </value>
            </default>
          </values>
        </parameter>
        <parameter name="PARAM_002">
          <values>
            <default>
              <participant type="METAMARKET" C="asx"/>
              <value>
                <number-value>750</number-value>
              </value>
            </default>
          </values>
        </parameter>
        <parameter name="PARAM_003">
          <values>
            <default>
              <participant type="METAMARKET" C="asx"/>
              <value>
                <string-value>NEW_PARAMETER</string-value>
              </value>
            </default>
          </values>
        </parameter>
      </grouping>
    </alert>
  </alerts>
</parameters>`;

export const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<parameters>
  <alerts>
    <alert filename="PatternAlerts.java">
      <grouping type="HOUSE">
        <parameter name="PARAM_001">
          <values>
            <default>
              <participant type="METAMARKET" C="asx"/>
              <value>
                <number-value>500</number-value>
              </value>
            </default>
          </values>
        </parameter>
      </grouping>
    </alert>
  </alerts>
<!-- Missing closing tag -->`;
