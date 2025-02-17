import { FunctionComponent, ChangeEvent, useEffect } from "react";
import type { Settings as TSettings } from "../state";
import { useState } from "react";
import { Box, TextInput, Button, Text } from "grommet";
import { Nodes, RadialSelected } from "grommet-icons";
import IconButton from "./icon-button";

const Settings: FunctionComponent<{
  settings: TSettings;
  updateSettings: (o: TSettings) => void;
  isReallyOnline: boolean;
  hasUpdatedSettings: boolean;
  setMaybeOnline: (maybeOnline: boolean) => void;
  setHasUpdatedSettings: (isUpdatedSettings: boolean) => void;
}> = ({ settings, updateSettings, isReallyOnline, hasUpdatedSettings, setMaybeOnline, setHasUpdatedSettings }) => {
  const [draft, setDraft] = useState<TSettings>({
    httpEndpoint: settings.httpEndpoint,
    wsEndpoint: settings.wsEndpoint,
    securityToken: settings.securityToken,
  });
  const [clusterNode, setClusterNode] = useState<number>(0);

  const updateClusterNode = () => {
    const CLUSTER_NODE = 5;
    clusterNode == CLUSTER_NODE ? setClusterNode(1) : setClusterNode(clusterNode + 1);
  }

  const HandleSetDraftSetting = <K extends keyof TSettings>(k: K) => {
    return (ev: ChangeEvent<HTMLInputElement>) => {
      setDraft((s) => ({
        ...s,
        [k]: ev.target.value,
      }));
    };
  };

  const handleSave = () => {
    updateSettings({
      httpEndpoint: draft.httpEndpoint,
      wsEndpoint: draft.wsEndpoint,
      securityToken: draft.securityToken,
    });
    setMaybeOnline(true);
    setHasUpdatedSettings(true);
  };

  const setEndpoint = (httpEndpoint: string, wsEndpoint: string, securityToken: string) => {
    setDraft(() => ({
      httpEndpoint,
      wsEndpoint,
      securityToken,
    }))
  }

  const setEndpointOfCluster = (index: number) => {
    const BASE_HTTP = 'http://localhost:1330'
    const BASE_WS = 'ws://localhost:1950'
    const DEFAULT_SECURITY_TOKEN = '^^LOCAL-testing-123^^'
    setEndpoint(BASE_HTTP + index, BASE_WS + index, DEFAULT_SECURITY_TOKEN)
  }

  const setEndpointOfDefault = () => {
    const BASE_HTTP = 'http://localhost:3000'
    const BASE_WS = 'ws://localhost:3001'
    const DEFAULT_SECURITY_TOKEN = ''
    setEndpoint(BASE_HTTP, BASE_WS, DEFAULT_SECURITY_TOKEN)
  }

  useEffect(() => {
    clusterNode != 0 && setEndpointOfCluster(clusterNode);
  }, [clusterNode])

  return (
    <Box shadow round pad="large" background="dark-4" gap="medium">
      <Box direction="row" alignSelf="center">
        <IconButton
          pad="small"
          alignSelf="center"
          round
          onClick={setEndpointOfDefault}
          margin="0"
        >
          <Box
            flex={{
              grow: 1,
            }}
            align="center"
          >
            <RadialSelected color="light-1" />
            <Text margin="xxsmall" size="xsmall">Default</Text>
          </Box>
        </IconButton>
        <IconButton
          pad="small"
          alignSelf="center"
          round
          onClick={updateClusterNode}
          margin="0"
        >
          <Box
            flex={{
              grow: 1,
            }}
            align="center"
          >
            <Nodes color="light-1" />
            <Text margin="xxsmall" size="xsmall">Cluster</Text>
          </Box>
        </IconButton>
      </Box>
      { (!isReallyOnline && hasUpdatedSettings) && <Text size="sm" color="fatal-error">Wrong settings, please verify.</Text> }
      <Box>
        HTTP endpoint:
        <TextInput
          placeholder="http://localhost:8080"
          value={draft.httpEndpoint}
          onChange={HandleSetDraftSetting("httpEndpoint")}
        />
      </Box>
      <Box>
        WS endpoint:
        <TextInput
          placeholder="ws://localhost:8081"
          value={draft.wsEndpoint}
          onChange={HandleSetDraftSetting("wsEndpoint")}
        />
      </Box>
      <Box>
        Security Token:
        <TextInput
          value={draft.securityToken || ""}
          onChange={HandleSetDraftSetting("securityToken")}
        />
      </Box>
      <Button label="save" onClick={handleSave} />
    </Box>
  );
};

export default Settings;
