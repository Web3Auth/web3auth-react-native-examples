#import <RCTDefaultReactNativeFactoryDelegate.h>
#import <RCTReactNativeFactory.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong, nonnull) UIWindow *window;
@property (nonatomic, strong, nonnull) RCTReactNativeFactory *reactNativeFactory;
@property (nonatomic, strong, nonnull) id<RCTReactNativeFactoryDelegate> reactNativeDelegate;

@end
