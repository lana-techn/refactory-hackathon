import { useState } from 'react';
import { Grid, Button, Box, Tabs, Tab } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ChatBox } from '../ChatBox';
import { SwaggerPreview } from '../SwaggerPreview';
import { ChatHistory, ChatMessage } from '../ChatHistory';
import { SuccessPage } from '../SuccessPage';

export const ExampleComponent = () => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<'generate' | 'refine'>('generate');
  const [activeTab, setActiveTab] = useState(0);

  const handleReset = () => {
    setGeneratedContent('');
    setShowSuccess(false);
    setChatMessages([]);
    setMode('generate');
    setActiveTab(0);
  };

  const handleResponse = (response: string) => {
    setGeneratedContent(response);
    if (mode === 'generate') {
      setMode('refine');
    }
  };

  const handleMessageSent = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  if (showSuccess) {
    return (
      <Page themeId="tool">
        <Header title="Spec & Ship" subtitle="AI-powered Software Specification">
          <HeaderLabel label="Owner" value="Team AI" />
          <HeaderLabel label="Lifecycle" value="Production" />
        </Header>
        <Content>
          <SuccessPage 
            content={generatedContent} 
            onReset={handleReset}
            serviceName="Generated Service"
          />
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Header title="Spec & Ship" subtitle="AI-powered Software Specification Generator">
        <HeaderLabel label="Owner" value="Platform Team" />
        <HeaderLabel label="Lifecycle" value="Production" />
      </Header>
      <Content>
        <ContentHeader title="🏗️ The Architect - Design Your API">
          <SupportButton>
            Jelaskan kebutuhan bisnis Anda dalam Bahasa Indonesia, dan AI akan mengubahnya menjadi OpenAPI specification yang lengkap.
          </SupportButton>
        </ContentHeader>

        <Grid container spacing={3}>
          {/* Left Column - Chat Interface */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <ChatBox 
                  onResponse={handleResponse}
                  onMessageSent={handleMessageSent}
                  currentSpec={generatedContent}
                  mode={mode}
                />
              </Grid>
              <Grid item>
                <ChatHistory messages={chatMessages} />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column - Preview */}
          <Grid item xs={12} md={7}>
            {generatedContent && (
              <>
                <Box mb={2}>
                  <Tabs 
                    value={activeTab} 
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="📋 Swagger UI" />
                    <Tab label="📝 YAML Source" />
                  </Tabs>
                </Box>

                {activeTab === 0 && (
                  <SwaggerPreview yamlContent={generatedContent} />
                )}

                {activeTab === 1 && (
                  <Box 
                    p={2} 
                    bgcolor="grey.900" 
                    color="white" 
                    borderRadius={4}
                    style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '12px',
                      maxHeight: '600px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {generatedContent}
                  </Box>
                )}

                <Box mt={3} display="flex" justifyContent="flex-end" style={{ gap: 16 }}>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                  >
                    🔄 Start Over
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setShowSuccess(true)}
                    style={{ 
                      fontSize: '18px',
                      padding: '12px 32px'
                    }}
                  >
                    SHIP IT! 🚀
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
