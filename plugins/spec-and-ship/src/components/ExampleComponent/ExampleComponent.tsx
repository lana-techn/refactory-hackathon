import React, { useState } from 'react';
import { Grid, Button, Box } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ChatBox } from '../ChatBox';
import { PreviewArea } from '../PreviewArea';
import { SuccessPage } from '../SuccessPage';

export const ExampleComponent = () => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReset = () => {
    setGeneratedContent('');
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <Page themeId="tool">
        <Header title="Spec & Ship" subtitle="AI-powered Software Specification">
          <HeaderLabel label="Owner" value="Team AI" />
          <HeaderLabel label="Lifecycle" value="Alpha" />
        </Header>
        <Content>
          <SuccessPage content={generatedContent} onReset={handleReset} />
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Header title="Spec & Ship" subtitle="AI-powered Software Specification">
        <HeaderLabel label="Owner" value="Team AI" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Generate Specification">
          <SupportButton>Describe what you want to build, and we will generate the specification for you.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <ChatBox onResponse={setGeneratedContent} />
          </Grid>
          {generatedContent && (
            <>
              <Grid item>
                <PreviewArea content={generatedContent} />
              </Grid>
              <Grid item>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setShowSuccess(true)}
                  >
                    Ship It! 🚀
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Content>
    </Page>
  );
};
