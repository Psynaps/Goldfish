import { Stack, Box, Text, Circle, Button, Icon } from '@chakra-ui/react'
import { ArrowRightIcon } from '@chakra-ui/icons'

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
          background="rgba(255, 255, 255, 0.1)"
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
            <Stack
              direction="row"
              justify="center"
              align="center"
              spacing="6.33px"
            >
              <Circle size="19px" background="#0AFF68" />
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
        >
          <Stack
            direction="row"
            justify="flex-start"
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
        paddingEnd="32px"
        paddingTop="80px"
        justify="flex-start"
        align="flex-start"
        flex="1"
        alignSelf="stretch"
      >
        <Stack
          justify="flex-start"
          align="flex-start"
          spacing="36px"
          alignSelf="stretch"
        >
          <Stack justify="center" align="flex-start">
            <Stack paddingY="20px" justify="center" align="flex-start">
              <Stack direction="row" justify="center" align="flex-start">
                <Text
                  fontFamily="Inter"
                  lineHeight="1.2"
                  fontWeight="bold"
                  fontSize="30px"
                  color="#FFFFFF"
                >
                  Hello, Peter.{' '}
                </Text>
              </Stack>
              <Stack direction="row" justify="center" align="flex-start">
                <Text
                  fontFamily="Inter"
                  lineHeight="1.2"
                  fontWeight="bold"
                  fontSize="20px"
                  color="#F2A5FF"
                >
                  <span>This is your jobs dashboard.</span>
                  <Box as="span" fontSize="36px">
                    {' '}
                  </Box>
                </Text>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              justify="center"
              align="flex-start"
              spacing="36px"
            >
              <Stack
                direction="row"
                justify="flex-start"
                align="center"
                spacing="12px"
              >
                <Text>
                  <Text
                    fontFamily="Inter"
                    lineHeight="1.2"
                    fontWeight="bold"
                    fontSize="20px"
                    color="#FFFFFF"
                  >
                    What would you like to view?{' '}
                  </Text>
                </Text>
                <Stack justify="flex-start" align="flex-start" />
              </Stack>
              <Stack
                paddingX="20px"
                paddingY="10px"
                borderRadius="6px"
                direction="row"
                justify="center"
                align="center"
                borderColor="#F1A0FF"
                borderStartWidth="2px"
                borderEndWidth="2px"
                borderTopWidth="2px"
                borderBottomWidth="2px"
                height="48px"
              >
                <Text
                  fontFamily="Inter"
                  lineHeight="1.2"
                  fontWeight="bold"
                  fontSize="16px"
                  color="#FFFFFF"
                >
                  All Saved
                </Text>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            paddingY="20px"
            justify="flex-start"
            align="flex-start"
            spacing="20px"
            height="733px"
            alignSelf="stretch"
          >
            <Stack
              direction="row"
              justify="space-between"
              align="flex-start"
              alignSelf="stretch"
            >
              <Stack
                direction="row"
                justify="center"
                align="center"
                spacing="12px"
              >
                <Stack direction="row" justify="flex-start" align="flex-start">
                  <Text
                    fontFamily="Inter"
                    lineHeight="1.5"
                    fontWeight="regular"
                    fontSize="18px"
                    color="#FFFFFF"
                  >
                    Date:{' '}
                  </Text>
                </Stack>
                <Stack
                  direction="row"
                  justify="flex-start"
                  align="flex-start"
                  spacing="8.35px"
                  width="30px"
                  height="30px"
                />
              </Stack>
              <Stack
                paddingX="28px"
                direction="row"
                justify="flex-start"
                align="flex-start"
                spacing="88px"
                width="563px"
                maxWidth="100%"
              >
                <Stack
                  direction="row"
                  justify="flex-start"
                  align="flex-start"
                  height="27px"
                >
                  <Text>
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.5"
                      fontWeight="regular"
                      fontSize="18px"
                      color="#FFFFFF"
                    >
                      Job Status
                    </Text>
                  </Text>
                  <Box />
                </Stack>
                <Stack direction="row" justify="flex-start" align="flex-start">
                  <Stack
                    direction="row"
                    justify="center"
                    align="center"
                    spacing="12px"
                  >
                    <Stack
                      direction="row"
                      justify="flex-start"
                      align="flex-start"
                    >
                      <Text
                        fontFamily="Inter"
                        lineHeight="1.5"
                        fontWeight="regular"
                        fontSize="18px"
                        color="#FFFFFF"
                      >
                        My Status
                      </Text>
                    </Stack>
                  </Stack>
                  <Box />
                </Stack>
                <Stack direction="row" justify="flex-start" align="flex-start">
                  <Stack
                    direction="row"
                    justify="center"
                    align="center"
                    spacing="12px"
                  >
                    <Stack
                      direction="row"
                      justify="flex-start"
                      align="flex-start"
                    >
                      <Text
                        fontFamily="Inter"
                        lineHeight="1.5"
                        fontWeight="regular"
                        fontSize="18px"
                        color="#FFFFFF"
                      >
                        Action
                      </Text>
                    </Stack>
                  </Stack>
                  <Box />
                </Stack>
              </Stack>
            </Stack>
            <Stack
              padding="20px"
              borderRadius="7px"
              direction="row"
              justify="space-between"
              align="center"
              spacing="7.58px"
              alignSelf="stretch"
              background="rgba(255, 255, 255, 0.1)"
            >
              <Stack justify="flex-start" align="center" alignSelf="stretch">
                <Stack justify="center" align="flex-start" spacing="14.06px">
                  <Stack direction="row" justify="flex-start" align="center">
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.5"
                      fontWeight="regular"
                      fontSize="14.84px"
                      color="#FFFFFF"
                    >
                      6/24/2023
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="flex-start"
                    align="center"
                    spacing="14px"
                  >
                    <Stack
                      padding="5.63px"
                      borderRadius="7.03px"
                      justify="flex-start"
                      align="flex-start"
                      spacing="5.63px"
                      overflow="hidden"
                      width="86.05px"
                      height="86.05px"
                    />
                    <Stack
                      justify="flex-start"
                      align="flex-start"
                      spacing="14.84px"
                    >
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.2"
                          fontWeight="bold"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Company Name
                        </Text>
                      </Stack>
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.5"
                          fontWeight="regular"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Sr. Sales Engineer
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                justify="space-between"
                align="flex-start"
                spacing="0px"
                width="511px"
                alignSelf="stretch"
                maxWidth="100%"
              >
                <Stack
                  direction="row"
                  justify="space-between"
                  align="flex-start"
                  spacing="88px"
                  alignSelf="stretch"
                >
                  <Stack
                    padding="8px"
                    direction="row"
                    justify="center"
                    align="center"
                    width="98px"
                  >
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.2"
                      fontWeight="bold"
                      fontSize="16px"
                      color="#FFFFFF"
                      width="88px"
                    >
                      Claimed
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="center"
                    align="center"
                    width="99px"
                  >
                    <Stack
                      direction="row"
                      justify="space-between"
                      align="flex-start"
                      width="34.79px"
                    />
                  </Stack>
                  <Button>
                    <Stack
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="6.16px"
                    >
                      <Button textAlign="center">Apply</Button>
                    </Stack>
                  </Button>
                </Stack>
                <Stack
                  paddingX="8px"
                  paddingY="4px"
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  alignSelf="stretch"
                />
                <Stack
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  width="511px"
                  maxWidth="100%"
                >
                  <ArrowRightIcon data-icon="CkArrowRight" />
                </Stack>
              </Stack>
            </Stack>
            <Stack
              padding="20px"
              borderRadius="7px"
              direction="row"
              justify="space-between"
              align="center"
              spacing="7.58px"
              alignSelf="stretch"
              background="rgba(255, 255, 255, 0.1)"
            >
              <Stack justify="flex-start" align="center" alignSelf="stretch">
                <Stack justify="center" align="flex-start" spacing="14.06px">
                  <Stack direction="row" justify="flex-start" align="center">
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.5"
                      fontWeight="regular"
                      fontSize="14.84px"
                      color="#FFFFFF"
                    >
                      6/24/2023
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="flex-start"
                    align="center"
                    spacing="14px"
                  >
                    <Stack
                      padding="5.63px"
                      borderRadius="7.03px"
                      justify="flex-start"
                      align="flex-start"
                      spacing="5.63px"
                      overflow="hidden"
                      width="86.05px"
                      height="86.05px"
                    />
                    <Stack
                      justify="flex-start"
                      align="flex-start"
                      spacing="14.84px"
                    >
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.2"
                          fontWeight="bold"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Company Name
                        </Text>
                      </Stack>
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.5"
                          fontWeight="regular"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Sr. Sales Engineer
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                justify="space-between"
                align="flex-start"
                spacing="0px"
                width="511px"
                alignSelf="stretch"
                maxWidth="100%"
              >
                <Stack
                  direction="row"
                  justify="space-between"
                  align="flex-start"
                  spacing="88px"
                  alignSelf="stretch"
                >
                  <Stack
                    padding="8px"
                    direction="row"
                    justify="center"
                    align="center"
                  >
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.2"
                      fontWeight="bold"
                      fontSize="16px"
                      color="#FFFFFF"
                    >
                      Unclaimed
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="center"
                    align="center"
                    width="99px"
                  >
                    <Stack
                      direction="row"
                      justify="space-between"
                      align="flex-start"
                      width="34.79px"
                    />
                  </Stack>
                  <Button>
                    <Stack
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="6.16px"
                    >
                      <Button textAlign="center">Apply</Button>
                      <Icon name="mail-fill" />
                    </Stack>
                  </Button>
                </Stack>
                <Stack
                  paddingX="8px"
                  paddingY="4px"
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  alignSelf="stretch"
                />
                <Stack
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  width="511px"
                  maxWidth="100%"
                >
                  <ArrowRightIcon data-icon="CkArrowRight" />
                </Stack>
              </Stack>
            </Stack>
            <Stack
              padding="20px"
              borderRadius="7px"
              direction="row"
              justify="space-between"
              align="center"
              spacing="7.58px"
              alignSelf="stretch"
              background="rgba(255, 255, 255, 0.1)"
            >
              <Stack justify="flex-start" align="center" alignSelf="stretch">
                <Stack justify="center" align="flex-start" spacing="14.06px">
                  <Stack direction="row" justify="flex-start" align="center">
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.5"
                      fontWeight="regular"
                      fontSize="14.84px"
                      color="#FFFFFF"
                    >
                      6/24/2023
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="flex-start"
                    align="center"
                    spacing="14px"
                  >
                    <Stack
                      padding="5.63px"
                      borderRadius="7.03px"
                      justify="flex-start"
                      align="flex-start"
                      spacing="5.63px"
                      overflow="hidden"
                      width="86.05px"
                      height="86.05px"
                    />
                    <Stack
                      justify="flex-start"
                      align="flex-start"
                      spacing="14.84px"
                    >
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.2"
                          fontWeight="bold"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Company Name
                        </Text>
                      </Stack>
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.5"
                          fontWeight="regular"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Sr. Sales Engineer
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                justify="space-between"
                align="flex-start"
                spacing="0px"
                width="511px"
                alignSelf="stretch"
                maxWidth="100%"
              >
                <Stack
                  direction="row"
                  justify="space-between"
                  align="flex-start"
                  spacing="88px"
                  alignSelf="stretch"
                >
                  <Stack
                    padding="8px"
                    direction="row"
                    justify="center"
                    align="center"
                  >
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.2"
                      fontWeight="bold"
                      fontSize="16px"
                      color="#FFFFFF"
                    >
                      Unclaimed
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="center"
                    align="center"
                    width="99px"
                  >
                    <Stack
                      direction="row"
                      justify="space-between"
                      align="flex-start"
                      width="34.79px"
                    />
                  </Stack>
                  <Button>
                    <Stack
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="6.16px"
                    >
                      <Button textAlign="center">Apply</Button>
                      <Icon name="mail-fill" />
                    </Stack>
                  </Button>
                </Stack>
                <Stack
                  paddingX="8px"
                  paddingY="4px"
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  alignSelf="stretch"
                />
                <Stack
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  width="511px"
                  maxWidth="100%"
                >
                  <ArrowRightIcon data-icon="CkArrowRight" />
                </Stack>
              </Stack>
            </Stack>
            <Stack
              padding="20px"
              borderRadius="7px"
              direction="row"
              justify="space-between"
              align="center"
              spacing="7.58px"
              alignSelf="stretch"
              background="rgba(255, 255, 255, 0.1)"
            >
              <Stack justify="flex-start" align="center" alignSelf="stretch">
                <Stack justify="center" align="flex-start" spacing="14.06px">
                  <Stack direction="row" justify="flex-start" align="center">
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.5"
                      fontWeight="regular"
                      fontSize="14.84px"
                      color="#FFFFFF"
                    >
                      6/24/2023
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="flex-start"
                    align="center"
                    spacing="14px"
                  >
                    <Stack
                      padding="5.63px"
                      borderRadius="7.03px"
                      justify="flex-start"
                      align="flex-start"
                      spacing="5.63px"
                      overflow="hidden"
                      width="86.05px"
                      height="86.05px"
                    />
                    <Stack
                      justify="flex-start"
                      align="flex-start"
                      spacing="14.84px"
                    >
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.2"
                          fontWeight="bold"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Company Name
                        </Text>
                      </Stack>
                      <Stack
                        paddingX="11.25px"
                        paddingY="8.44px"
                        borderRadius="7.03px"
                        direction="row"
                        justify="center"
                        align="center"
                        spacing="5.63px"
                        height="35.61px"
                        background="rgba(113, 204, 255, 0.4)"
                      >
                        <Text
                          fontFamily="Inter"
                          lineHeight="1.5"
                          fontWeight="regular"
                          fontSize="14.84px"
                          color="#FFFFFF"
                        >
                          Sr. Sales Engineer
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                justify="space-between"
                align="flex-start"
                spacing="0px"
                width="511px"
                alignSelf="stretch"
                maxWidth="100%"
              >
                <Stack
                  direction="row"
                  justify="space-between"
                  align="flex-start"
                  spacing="88px"
                  alignSelf="stretch"
                >
                  <Stack
                    padding="8px"
                    direction="row"
                    justify="center"
                    align="center"
                  >
                    <Text
                      fontFamily="Inter"
                      lineHeight="1.2"
                      fontWeight="bold"
                      fontSize="16px"
                      color="#FFFFFF"
                    >
                      Unclaimed
                    </Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="center"
                    align="center"
                    width="99px"
                  >
                    <Stack
                      direction="row"
                      justify="space-between"
                      align="flex-start"
                      width="34.79px"
                    />
                  </Stack>
                  <Button>
                    <Stack
                      direction="row"
                      justify="center"
                      align="center"
                      spacing="6.16px"
                    >
                      <Button textAlign="center">Apply</Button>
                      <Icon name="mail-fill" />
                    </Stack>
                  </Button>
                </Stack>
                <Stack
                  paddingX="8px"
                  paddingY="4px"
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  alignSelf="stretch"
                />
                <Stack
                  direction="row"
                  justify="flex-end"
                  align="flex-end"
                  width="511px"
                  maxWidth="100%"
                >
                  <ArrowRightIcon data-icon="CkArrowRight" />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
)