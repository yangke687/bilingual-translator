import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <Flex direction="column" align="center" gap="3">
          <ExclamationTriangleIcon width={40} height={40} />
          <Heading size="8">404</Heading>
          <Text size="3" color="gray">
            The page you are looking for doesn’t exist or has been moved.
          </Text>
          <Flex gap="3" mt="3">
            <Button onClick={() => navigate('/')}>Back to Home</Button>
            <Button variant="soft" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
