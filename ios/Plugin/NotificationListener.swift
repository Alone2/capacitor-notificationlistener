import Foundation

@objc public class NotificationListener: NSObject {
    @objc public func echo(_ value: String) -> String {
        return value
    }
}
