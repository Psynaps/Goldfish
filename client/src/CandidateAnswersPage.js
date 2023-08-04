import { Stack, Box, Text, Circle, Button, Icon } from '@chakra-ui/react'

export const App = () => (
  <Stack
    justify="flex-start"
    align="flex-start"
    spacing="0px"
    overflow="hidden"
    width="1280px"
    maxWidth="100%"
    background="#051672"
  >
    <Stack
      direction="row"
      justify="center"
      align="flex-end"
      spacing="0px"
      overflow="hidden"
      borderColor="#FFFFFF"
      borderBottomWidth="1px"
      borderStyle="dashed"
      height="280px"
      alignSelf="stretch"
      background="linear-gradient(124deg, #1a298066 0%, #26d0ce4d 100%)"
    >
      <Stack
        paddingX="50px"
        paddingY="10px"
        direction="row"
        justify="space-between"
        align="flex-end"
        spacing="843px"
        flex="1"
      >
        <Stack
          paddingEnd="70px"
          direction="row"
          justify="center"
          align="flex-end"
          spacing="16px"
        >
          <Stack direction="row" justify="flex-start" align="flex-start">
            <Box
              borderRadius="20px"
              width="80px"
              height="80.16px"
              borderColor="#051672"
              borderStartWidth="3px"
              borderEndWidth="3px"
              borderTopWidth="3px"
              borderBottomWidth="3px"
            />
          </Stack>
          <Stack direction="row" justify="flex-start" align="flex-start">
            <Text
              fontFamily="Inter"
              lineHeight="1.2"
              fontWeight="bold"
              fontSize="20px"
              color="#FFFFFF"
            >
              Goldfish AI
            </Text>
          </Stack>
        </Stack>
        <Stack justify="center" align="flex-start">
          <Stack
            direction="row"
            justify="flex-end"
            align="flex-end"
            spacing="18px"
            height="80px"
            alignSelf="stretch"
          >
            <Circle size="74px" />
            <Stack
              direction="row"
              justify="flex-end"
              align="flex-end"
              spacing="29px"
            >
              <Text
                fontFamily="Inter"
                lineHeight="1.2"
                fontWeight="bold"
                fontSize="20px"
                color="#FFFFFF"
              >
                Peter G.{' '}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
    <Stack
      direction="row"
      justify="flex-start"
      align="flex-start"
      spacing="0px"
      overflow="hidden"
      height="1152px"
      alignSelf="stretch"
    >
      <Stack
        paddingY="100px"
        justify="flex-start"
        align="center"
        spacing="0px"
        overflow="hidden"
        borderColor="#FFFFFF"
        borderEndWidth="1px"
        borderStyle="dashed"
        width="250px"
        alignSelf="stretch"
        maxWidth="100%"
        background="linear-gradient(153deg, #1a298099 0%, #26d0ce4d 100%)"
      >
        <Stack
          padding="36px"
          direction="row"
          justify="flex-start"
          align="center"
          alignSelf="stretch"
        >
          <Stack
            direction="row"
            justify="center"
            align="center"
            spacing="20px"
            height="36px"
          >
            <Stack
              justify="center"
              align="flex-end"
              width="36px"
              height="36px"
            />
            <Text>
              <Text
                fontFamily="Inter"
                lineHeight="1.2"
                fontWeight="bold"
                fontSize="20px"
                color="#FFFFFF"
              >
                Home
              </Text>
            </Text>
          </Stack>
        </Stack>
        <Stack
          padding="36px"
          direction="row"
          justify="flex-start"
          align="center"
          alignSelf="stretch"
        >
          <Stack
            direction="row"
            justify="center"
            align="center"
            spacing="20px"
            height="35px"
          >
            <Box />
            <Text>
              <Text
                fontFamily="Inter"
                lineHeight="1.2"
                fontWeight="bold"
                fontSize="20px"
                color="#FFFFFF"
              >
                Matches
              </Text>
            </Text>
          </Stack>
        </Stack>
        <Stack
          padding="36px"
          direction="row"
          justify="flex-start"
          align="center"
          alignSelf="stretch"
          background="rgba(255, 255, 255, 0.1)"
        >
          <Stack
            direction="row"
            justify="center"
            align="center"
            spacing="20px"
            width="171px"
            height="36px"
          >
            <Stack direction="row" justify="center" align="center" />
            <Text>
              <Text
                fontFamily="Inter"
                lineHeight="1.2"
                fontWeight="bold"
                fontSize="20px"
                color="#FFFFFF"
              >
                Answer{' '}
              </Text>
            </Text>
            <Stack
              direction="row"
              justify="center"
              align="center"
              spacing="6.33px"
            >
              <Circle size="19px" background="green.400" />
            </Stack>
          </Stack>
        </Stack>
        <Stack
          padding="36px"
          direction="row"
          justify="flex-start"
          align="center"
          alignSelf="stretch"
        >
          <Stack
            direction="row"
            justify="center"
            align="center"
            spacing="20px"
            height="35px"
          >
            <Box />
            <Text>
              <Text
                fontFamily="Inter"
                lineHeight="1.2"
                fontWeight="bold"
                fontSize="20px"
                color="#FFFFFF"
              >
                Profile{' '}
              </Text>
            </Text>
          </Stack>
        </Stack>
        <Stack
          padding="36px"
          direction="row"
          justify="flex-start"
          align="center"
          alignSelf="stretch"
        >
          <Stack
            direction="row"
            justify="center"
            align="center"
            spacing="20px"
            height="35px"
          >
            <Box />
            <Stack justify="center" align="center">
              <Text>
                <Text
                  fontFamily="Inter"
                  lineHeight="1.2"
                  fontWeight="bold"
                  fontSize="20px"
                  color="#FFFFFF"
                >
                  Admin
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        paddingStart="64px"
        paddingTop="80px"
        justify="center"
        align="flex-start"
        flex="1"
        alignSelf="stretch"
      >
        <Stack
          paddingEnd="64px"
          justify="flex-start"
          align="flex-start"
          spacing="48px"
          flex="1"
          alignSelf="stretch"
        >
          <Stack justify="flex-start" align="flex-start" spacing="20px">
            <Stack direction="row" justify="flex-start" align="flex-start">
              <Text
                fontFamily="Inter"
                lineHeight="1.2"
                fontWeight="bold"
                fontSize="20px"
                color="#F2A5FF"
              >
                Answer more questions to improve next week’s results.{' '}
              </Text>
            </Stack>
            <Stack
              direction="row"
              justify="flex-start"
              align="flex-start"
              spacing="7.35px"
            >
              <Button height="58.78px">
                <Stack
                  direction="row"
                  justify="center"
                  align="center"
                  spacing="7.35px"
                >
                  <Button textAlign="center">Qurstion Category </Button>
                  <Icon name="mail-fill" />
                </Stack>
              </Button>
              <Stack
                paddingX="18.37px"
                paddingY="9.18px"
                borderRadius="5.51px"
                direction="row"
                justify="center"
                align="center"
                spacing="7.35px"
                borderColor="#F2A5FF"
                borderStartWidth="0.92px"
                borderEndWidth="0.92px"
                borderTopWidth="0.92px"
                borderBottomWidth="0.92px"
                height="58.78px"
              >
                <Text
                  fontFamily="Inter"
                  lineHeight="1.2"
                  fontWeight="bold"
                  fontSize="14.7px"
                  color="#FFFFFF"
                >
                  Question Category{' '}
                </Text>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            justify="flex-start"
            align="flex-start"
            spacing="0px"
            overflow="hidden"
            alignSelf="stretch"
          >
            <Stack
              justify="flex-start"
              align="center"
              spacing="0px"
              alignSelf="stretch"
            >
              <Stack
                justify="flex-start"
                align="center"
                spacing="36px"
                alignSelf="stretch"
              >
                <Stack
                  justify="flex-start"
                  align="flex-start"
                  alignSelf="stretch"
                >
                  <Stack
                    padding="20px"
                    borderRadius="20px"
                    direction="row"
                    justify="flex-start"
                    align="center"
                    borderColor="#FFFFFF"
                    borderStartWidth="1px"
                    borderEndWidth="1px"
                    borderTopWidth="1px"
                    borderBottomWidth="1px"
                    alignSelf="stretch"
                  >
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.2"
                      fontWeight="bold"
                      fontSize="20px"
                      color="#FFFFFF"
                      flex="1"
                    >
                      Sample text.{' '}
                    </Text>
                  </Stack>
                </Stack>
                <Stack
                  justify="flex-start"
                  align="center"
                  spacing="60px"
                  alignSelf="stretch"
                >
                  <Stack
                    paddingStart="36px"
                    justify="center"
                    align="flex-start"
                    spacing="20px"
                    alignSelf="stretch"
                  >
                    <Stack
                      padding="24px"
                      borderRadius="10px"
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="16px"
                      borderColor="green.300"
                      borderStartWidth="1px"
                      borderEndWidth="1px"
                      borderTopWidth="1px"
                      borderBottomWidth="1px"
                      alignSelf="stretch"
                      background="rgba(255, 255, 255, 0.2)"
                    >
                      <Text
                        fontFamily="Inter"
                        lineHeight="1.5"
                        fontWeight="regular"
                        fontSize="20px"
                        color="white"
                        flex="1"
                      >
                        No experience
                      </Text>
                    </Stack>
                    <Stack
                      padding="24px"
                      borderRadius="10px"
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="16px"
                      borderColor="white"
                      borderStartWidth="1px"
                      borderEndWidth="1px"
                      borderTopWidth="1px"
                      borderBottomWidth="1px"
                      alignSelf="stretch"
                      background="rgba(255, 255, 255, 0.2)"
                    >
                      <Text
                        fontFamily="Inter"
                        lineHeight="1.5"
                        fontWeight="regular"
                        fontSize="20px"
                        color="white"
                        flex="1"
                      >
                        Beginner: Have participated in API implementation for
                        customers with support from a team, but have not led the
                        process.
                      </Text>
                    </Stack>
                    <Stack
                      padding="24px"
                      borderRadius="10px"
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="16px"
                      borderColor="white"
                      borderStartWidth="1px"
                      borderEndWidth="1px"
                      borderTopWidth="1px"
                      borderBottomWidth="1px"
                      alignSelf="stretch"
                      background="rgba(255, 255, 255, 0.2)"
                    >
                      <Text
                        fontFamily="Inter"
                        lineHeight="1.5"
                        fontWeight="regular"
                        fontSize="20px"
                        color="white"
                        flex="1"
                      >
                        Intermediate: Have regularly led the process of
                        implementing APIs for customers, with an understanding
                        of the associated practices and protocols.
                      </Text>
                    </Stack>
                    <Stack
                      padding="24px"
                      borderRadius="10px"
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="16px"
                      borderColor="white"
                      borderStartWidth="1px"
                      borderEndWidth="1px"
                      borderTopWidth="1px"
                      borderBottomWidth="1px"
                      alignSelf="stretch"
                      background="rgba(255, 255, 255, 0.2)"
                    >
                      <Text
                        fontFamily="Inter"
                        lineHeight="1.5"
                        fontWeight="regular"
                        fontSize="20px"
                        color="white"
                        flex="1"
                      >
                        Advanced: Have extensive experience in independently
                        leading the process of API implementation for a variety
                        of customers, with the ability to troubleshoot issues
                        and optimize the process.
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
)
